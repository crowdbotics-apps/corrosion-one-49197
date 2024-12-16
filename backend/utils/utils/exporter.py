import csv
import io
from collections import OrderedDict
from enum import Enum
from functools import wraps

from rest_framework.exceptions import ValidationError

from utils.utils import file_response


class ExportFormat(Enum):
    CSV = ('csv', 'text/csv')
    XLS = ('xls', 'application/vnd.ms-excel')
    XLSX = ('xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')


def export_to_file(func_outer=None, export_type: ExportFormat = ExportFormat.XLSX, many=True):
    """
    Decorator for exporting data to file
    override/reimplement a list function like this:

        @action(detail=False, methods=['get'])
        @export_to_file(export_type=ExportFormat.XLS)
        def export(self, request, *args, **kwargs):
            return super().list(request, *args, **kwargs), 'export_filename'

    Select the appropriate serializer for the report type, the correct queryset and return it.
    To change the name of the columns, add the fields_names attribute to the serializer Meta class, like this:

        class MySerializer(serializers.ModelSerializer):
            class Meta:
                model = MyModel
                fields = ['col1', 'col2__name', 'col3__id']
                fields_names = ['Column 1', 'Column 2', 'Column 3']


    The decorator will take care of the rest.
    The filename is optional, and if not returned will be the name of the function.
    If the view action is implemented as above, you can filter using the appropiate query params,
    it uses all the params and filters, just like a normal list view.
    This also automatically handles pagination, so you can export all the data, not just the first page.
    """
    # TODO implement hooks for more complex xls/xlsx export
    # TODO implement export type override by params in the request

    def decorator(func):
        @wraps(func)
        def wrapper(self, *args, **kwargs):
            # Save the current _paginator, Set _paginator to None
            saved_paginator, self._paginator = self.paginator, None
            export_extension, export_mime = export_type.value
            try:
                # Call the wrapped method
                response = func(self, *args, **kwargs)
                if isinstance(response, tuple):
                    response, filename = response
                    filename = filename if filename.endswith(export_extension) else f'{filename}.{export_extension}'
                else:
                    filename = f'{func.__name__}.{export_extension}'
            finally:
                # Restore the _paginator
                self._paginator = saved_paginator

            if not many:
                raise NotImplementedError('Not implemented for single object')

            serializer = self.get_serializer([], many=many).child  # not child for many = False
            fields = list(serializer.fields.keys())
            header_row = getattr(serializer.Meta, 'fields_names', fields)

            def getrow(row):
                return [row[field] for field in fields] if not isinstance(row, OrderedDict) else list(row.values())

            match export_type:
                case ExportFormat.CSV:
                    nfile = io.StringIO()
                    writer = csv.writer(nfile)
                    writer.writerow(header_row)
                    for row in response.data:
                        writer.writerow(getrow(row))
                    return file_response(nfile.getvalue(), filename=filename, content_type='text/csv')

                case ExportFormat.XLS:
                    try:
                        import xlwt
                    except ImportError:
                        raise ValidationError('Please install xlwt to use this export type')
                    wb = xlwt.Workbook()
                    ws = wb.add_sheet('Sheet1')

                    # Write rows to the worksheet
                    for row_num, row in enumerate(response.data):
                        row = getrow(row)
                        for col_num, item in enumerate(row):
                            ws.write(row_num, col_num, item)

                    # Save the workbook to a BytesIO object
                    xls_file = io.BytesIO()
                    wb.save(xls_file)

                case ExportFormat.XLSX:
                    try:
                        from openpyxl import Workbook
                    except ImportError:
                        raise ValidationError('Please install openpyxl to use this export type')
                    wb = Workbook()
                    ws = wb.active
                    ws.append(header_row)
                    for row in response.data:
                        ws.append((getrow(row)))
                    nfile = io.BytesIO()
                    wb.save(nfile)
                    return file_response(nfile.getvalue(), filename=filename, content_type='text/csv')

                case _:
                    raise ValidationError(f'Export type {export_type} not implemented')

            return response

        return wrapper

    return decorator if func_outer is None else decorator(func_outer)
