# Generated by Django 5.2.4 on 2025-07-19 11:11

import dalalapi.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dalalapi', '0005_alter_recruiteeprofile_cv'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recruiteeprofile',
            name='cv',
            field=models.FileField(upload_to=dalalapi.models.custom_cv_upload_path),
        ),
    ]
