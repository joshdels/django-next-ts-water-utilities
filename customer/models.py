from django.db import models


class PotentialCustomer(models.Model):
    full_name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField()
    inquires = models.TextField(blank=True, null=True)
    files = models.FileField(upload_to="customer/inquires/", blank=True, null=True)
    is_answered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
