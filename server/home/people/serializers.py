from rest_framework import serializers 
from .models import Tags, People

class TagsSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Tags 
        fields = ['tags_id', 'name', 'colorname', 'created_at', 'updated_at', 'user']
        read_only_fields = ['tags_id', 'created_at', 'updated_at', 'user']  
    
    def create(self, validated_data):
        user = self.context['request'].user
        return Tags.objects.create(user=user, **validated_data)
    
class PeopleSerializer(serializers.ModelSerializer):
    class Meta:
        model = People
        fields = '__all__'
        many = True 