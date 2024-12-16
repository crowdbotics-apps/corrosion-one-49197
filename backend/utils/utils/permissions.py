from rest_framework import permissions
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return getattr(request.user, 'is_staff', False)


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return getattr(request.user, 'is_superuser', False)


IsStaffOrAdmin = IsStaff | IsAdmin


class IsReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS
