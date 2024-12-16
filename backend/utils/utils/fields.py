from django.core.validators import URLValidator
from rest_framework.fields import SkipField, FileField
from django.forms import ImageField as DjangoImageField
from django.utils.translation import gettext_lazy as _

class SmartUpdatableFileField(FileField):
    val = URLValidator()
    cached_dict = None

    def validate_model_url(self, url):
        try:
            self.val(url)

            parent = self.parent
            meta = type(parent).Meta
            object_class = meta.model
            pk_field = object_class._meta.pk.name

            # TODO better
            assert pk_field in parent.fields, f'The field "{pk_field}" must be included in the {parent.__class__.__name__} (usually added automatically) fields for this field to work ({self.field_name} => {self.__class__.__name__})'

            if pk_field in parent.fields:
                pk_value = parent.fields[pk_field].get_value(self.cached_dict)
                current_object = object_class.objects.get(pk=pk_value)
                representation = self.to_representation(getattr(current_object, self.field_name))
                return representation == url

            self.cached_dict = None
        except:
            pass
        return False

    def get_value(self, dictionary):
        # not ideal, but whatever
        self.cached_dict = dictionary
        return super().get_value(dictionary)

    def to_internal_value(self, data):
        if isinstance(data,str) and self.validate_model_url(data):
            raise SkipField()

        return super().to_internal_value(data)


class SmartUpdatableImageField(SmartUpdatableFileField):
    default_error_messages = {
        'invalid_image': _(
            'Upload a valid image. The file you uploaded was either not an image or a corrupted image.'
        ),
    }

    def __init__(self, **kwargs):
        self._DjangoImageField = kwargs.pop('_DjangoImageField', DjangoImageField)
        super().__init__(**kwargs)

    def to_internal_value(self, data):
        # Image validation is a bit grungy, so we'll just outright
        # defer to Django's implementation so we don't need to
        # consider it, or treat PIL as a test dependency.
        file_object = super().to_internal_value(data)
        django_field = self._DjangoImageField()
        django_field.error_messages = self.error_messages
        return django_field.clean(file_object)