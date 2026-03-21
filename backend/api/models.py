from django.db import models
from django.contrib.gis.db import models


class Project(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)


class Asset(models.Model):
    ASSET_TYPE = [
        ("pipe", "Pipe"),
        ("value", "Valve"),
        ("hydrant", "Hydrant"),
        ("pump", "Pump"),
    ]

    project = (models.ForeignKey(Project, on_delete=models.CASCADE),)
    asset_type = models.CharField(max_length=20, choices=ASSET_TYPE)
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=50, default="active")


class Node(models.Model):
    asset = models.OneToOneField(Asset, on_delete=models.CASCADE)
    geometry = models.PointField()


class Pipe(models.Model):
    asset = models.OneToOneField(Asset, on_delete=models.CASCADE)
    start_node = models.ForeignKey(
        Node, on_delete=models.CASCADE, related_name="start_pipes"
    )
    end_node = models.ForeignKey(
        Node, on_delete=models.CASCADE, related_name="end_pipes"
    )
    geometry = models.LineStringField()
    diameter = models.FloatField()
    material = models.CharField(max_length=50)
