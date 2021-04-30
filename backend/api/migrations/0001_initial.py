# Generated by Django 2.2.20 on 2021-04-30 09:03

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Stock',
            fields=[
                ('ticker', models.CharField(max_length=5, primary_key=True, serialize=False)),
                ('issueType', models.CharField(choices=[('Common Stock', 'cs'), ('ETF', 'et'), ('Preferred Stock', 'ps'), ('Unit', 'ut'), ('Warrant', 'wt'), ('ADR', 'ad'), ('Closed End Fund', 'cef'), ('Open Ended Fund', 'oef'), ('Right', 'rt'), ('Structured Product', 'struct'), ('When Issued', 'wi'), ('Other', '')], default='', max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='TopList',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('updated_on', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='StockList',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=20, unique=True)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('updated_on', models.DateTimeField(auto_now=True)),
                ('stocks', models.ManyToManyField(to='api.Stock')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='stock',
            name='toplist',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.TopList'),
        ),
    ]
