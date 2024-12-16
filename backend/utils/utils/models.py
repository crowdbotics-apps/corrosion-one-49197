
class CopyModelMixin:
    attrs_to_copy = []  # override this
    """
    Mixin to add a method get_copy() to copy the model instance
    """

    def get_copy(self, *_, extra_attrs=None, save_copy=False, init_args=None, init_kwargs=None, **overrides):
        """
        Copy a model instance
        """
        if init_args is None:
            init_args = []
        if init_kwargs is None:
            init_kwargs = {}
        if extra_attrs is None:
            extra_attrs = []
        copy = self.__class__(*init_args, **init_kwargs)
        attrs = set(self.attrs_to_copy + extra_attrs)
        for attr in attrs:
            if attr not in overrides:
                setattr(copy, attr, getattr(self, attr))

        for attr, value in overrides.items():
            setattr(copy, attr, value)

        if save_copy:
            copy.save()

        return copy
