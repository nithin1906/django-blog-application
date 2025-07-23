from rest_framework import serializers
from .models import Post
from django.contrib.auth.models import User

class PostSerializer(serializers.ModelSerializer):
    """
    Serializer for the Post model.
    """
    # We want to display the author's username, not just their ID.
    author = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Post
        # Fields to include in the serialized output.
        fields = ['id', 'title', 'content', 'created_at', 'author']