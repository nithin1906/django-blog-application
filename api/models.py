from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Post(models.Model):
    """
    Represents a blog post in the database.
    """
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Links each post to a specific user (author).
    # If the user is deleted, all their posts will be deleted as well.
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')

    def __str__(self):
        """
        A string representation of the Post model, used in the Django admin site.
        """
        return f'"{self.title}" by {self.author.username}'