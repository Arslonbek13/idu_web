from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse
from django.shortcuts import render, redirect

from news_app.models import Category
from .forms import LoginForm, UserRegistrationForm, UserEditForm, ProfileEditForm
from .models import Profile


def _get_profile_for_user(user):
    try:
        return user.profile
    except ObjectDoesNotExist:
        return None


def _build_profile_form(profile, *args, **kwargs):
    if profile:
        return ProfileEditForm(instance=profile, *args, **kwargs)
    return ProfileEditForm(*args, **kwargs)


def _save_profile_form(profile_form, user):
    profile = profile_form.save(commit=False)
    profile.user = user
    profile.save()



def user_login(request):
    categories = Category.objects.all()
    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            data = form.cleaned_data
            user = authenticate(request,
                                username=data['username'],
                                password=data['password'])
            if user is not None:
                if user.is_active:
                    login(request, user)
                    return HttpResponse('Login is successful!')
                else:
                    return HttpResponse('Your profile is not active')
            else:
                return HttpResponse('There is an error in the login or password')
    else:
        form = LoginForm()
    context = {
        'form': form,
        'categories': categories,
    }
    return render(request, 'registration/login.html', context)

@login_required
def dashboard_view(request):
    user = request.user
    profile_info = user.profile
    categories = Category.objects.all()
    context = {
        'user': user,
        'profile': profile_info,
        'categories': categories
    }
    return render(request, 'pages/user_profile.html', context)



def user_register(request):
    if request.method == "POST":
        user_form = UserRegistrationForm(request.POST)
        if user_form.is_valid():
            new_user = user_form.save(commit=False)
            new_user.set_password(user_form.cleaned_data["password"])
            categories = Category.objects.all()
            new_user.save()
            Profile.objects.create(user=new_user)
            context = {
                'new_user': new_user,
                'categories': categories
            }
            return render(request, 'account/register_done.html', context)
        else:
            # Return an error response if the form is not valid
            context = {
                'user_form': user_form
            }
            return render(request, 'account/register.html', context)
    else:
        user_form = UserRegistrationForm()
        categories = Category.objects.all()
        context = {
            'user_form': user_form,
            'categories': categories
        }
        return render(request, 'account/register.html', context)
@login_required
def edit_user(request):
    profile = _get_profile_for_user(request.user)

    if request.method == 'POST':
        user_form = UserEditForm(instance=request.user, data=request.POST)
        profile_form = _build_profile_form(profile, data=request.POST, files=request.FILES)
        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            _save_profile_form(profile_form, request.user)
        return redirect('user_profile')

    user_form = UserEditForm(instance=request.user)
    profile_form = _build_profile_form(profile)
    return render(request, 'account/profile_edit.html', {"user_form": user_form, "profile_form": profile_form})
