# from django_filters import rest_framework as filters
from django.db.models import Q, F, Count
from rest_framework.filters import OrderingFilter

from jobs.models import Job


# class CharInFilter(filters.BaseInFilter, filters.CharFilter):
#     """
#     Filter field specific to pass string between comas, will ignore the spaces on strings.
#     """
#     pass


class CustomOrderingFilterJobs(OrderingFilter):

    def filter_queryset(self, request, queryset, view):
        ordering = self.get_ordering(request, queryset, view)
        group_ordering = request.query_params.get('ordering', '')
        direction = '-' if group_ordering and group_ordering[0] == '-' else ''
        row = group_ordering[1:] if direction else group_ordering
        match row:
            case 'views':
                queryset = queryset.annotate(property_value=F('views')).order_by(direction + 'property_value')
            case 'bids':
                queryset = queryset.annotate(bid_count=Count('bids')).order_by(direction + 'bid_count')
        if ordering:
            queryset = queryset.order_by(*ordering)
        return queryset


class CustomOrderingFilterBids(OrderingFilter):

    def filter_queryset(self, request, queryset, view):
        ordering = self.get_ordering(request, queryset, view)
        group_ordering = request.query_params.get('ordering', '')
        direction = '-' if group_ordering and group_ordering[0] == '-' else ''
        row = group_ordering[1:] if direction else group_ordering
        match row:
            case 'job':
                queryset = queryset.annotate(property_value=F('job__title')).order_by(direction + 'property_value')
            case 'inspector':
                queryset = queryset.annotate(property_value=F('inspector__user__first_name')).order_by(direction + 'property_value')
        if ordering:
            queryset = queryset.order_by(*ordering)
        return queryset