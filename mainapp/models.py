from django.db import models

class AIHistory(models.Model):
    prompt = models.TextField()
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.prompt[:50]

class StudyItem(models.Model):
    subject = models.CharField(max_length=100)
    target_time = models.IntegerField()
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.subject

class GeneratedProject(models.Model):
    name = models.CharField(max_length=200)
    prompt = models.TextField()
    theme_slug = models.CharField(max_length=100)
    react_code = models.TextField()
    css_code = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class ProjectData(models.Model):
    project = models.ForeignKey(GeneratedProject, on_delete=models.CASCADE, related_name="data_entries")
    payload = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Data for {self.project.name} at {self.created_at}"