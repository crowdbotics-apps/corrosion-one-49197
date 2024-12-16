def sort_tasks(serialized_data):
    """
    Sort serialized tasks by "completed" value.
    """
    tasks = serialized_data.get('tasks', [])
    tasks_sorted = sorted(tasks, key=lambda x: (
        x['completed'],
        x['custom_order'] if x['custom_order'] is not None else x['id']
    ))
    serialized_data['tasks'] = tasks_sorted
    return serialized_data