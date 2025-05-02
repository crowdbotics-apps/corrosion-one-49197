from django.core.files import File

from configuration.utils import ConfigKey


# TEST = ConfigKey(
#     value=1,
#     verbose_name='Test configuration value',
#     validation_function=lambda key, value: isinstance(value, int) and value > 0
# )
#
# TEST_NOT_FILE = ConfigKey(
#     value=1,
#     verbose_name='Test configuration value',
#     validation_function=lambda key, value: not isinstance(value, File)
# )
#
#
# TEST2 = 45
#
# TEST3 = "hola que tal"

OWNER_CHARGE_PERCENT = ConfigKey(
    value=10,
    verbose_name='Owner charge percentage',
)

INSPECTOR_CHARGE_PERCENT = ConfigKey(
    value=5,
    verbose_name='Inspector charge percentage',
)
















# don't touch this
from configuration.utils import setup_configs_hooks
setup_configs_hooks()
