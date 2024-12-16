"""permissions.py"""
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    """
     Custom permission class that checks if the user has admin privileges.

    The user must be authenticated, and either be an admin or a superuser to have permission.
    If the user meets these conditions, this permission allows access; otherwise, it denies access.
    """
    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and (user.is_admin or user.is_superuser))


class ReadOnly(BasePermission):
    """
    Custom permission class that allows read-only access for safe methods.

    This permission allows access only for HTTP methods that are considered safe (e.g., GET, HEAD, OPTIONS).
    All other methods are denied access.
    """
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS