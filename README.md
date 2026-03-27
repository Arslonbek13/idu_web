# Newsfeed Project — Django

A multi-language newsfeed web application built with Django 4.1.7.
Supports English, Uzbek, and Russian. Covers local, world, technology, and sport news categories.

---

## Features

- Multi-language news (English / Uzbek / Russian) via `django-modeltranslation`
- News categories: Local, World, Technology, Sport
- Per-article view counting (`django-hitcount`)
- Comment system (authenticated users)
- User registration, login, profile editing, and photo upload
- Superuser-only news CRUD (create, edit, delete)
- Contact form
- Full-text search across all language fields
- WhiteNoise static file serving with compression and cache-busting
- SonarQube / SonarCloud analysis ready (see `sonar-project.properties`)

---

## Requirements

- Python 3.11+
- pip
- `gettext` system package (required for translation compilation)

Install `gettext` on your OS if you need to recompile translations:

```bash
# Ubuntu / Debian / WSL
sudo apt install gettext

# macOS
brew install gettext
```

---

## Quick start

### 1. Clone the repository

```bash
git clone https://github.com/Arslonbek13/newsfeed_project_django.git
cd newsfeed_project_django
```

### 2. Create and activate a virtual environment

```bash
python -m venv venv

# Linux / macOS / WSL
source venv/bin/activate

# Windows (Command Prompt)
venv\Scripts\activate.bat

# Windows (PowerShell)
venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file in the project root (same directory as `manage.py`):

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
```

Generate a strong secret key:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

> `.env` is excluded from git by `.gitignore` and must be created manually on each machine.

### 5. Apply database migrations

```bash
python manage.py migrate
```

### 6. Compile translation files

```bash
python manage.py compilemessages
```

> This step requires the `gettext` system package. If skipped, the site works in English only.

### 7. Collect static files

```bash
python manage.py collectstatic --noinput
```

> Collects and compresses all static files into `staticfiles/`. Required for WhiteNoise to serve them correctly.

### 8. Create a superuser

```bash
python manage.py createsuperuser
```

The superuser account is required to create, edit, and delete news articles.

### 9. Run the development server

```bash
python manage.py runserver
```

Visit [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## URL reference

| URL | Name | Description | Auth required |
|---|---|---|---|
| `/en/` | `home_page` | Home — featured news, category sections | No |
| `/en/news/` | `all_news_list` | Full news list | No |
| `/en/news/<slug>/` | `news_detail_page` | Article detail + comments | No |
| `/en/local/` | `local_news_page` | Local news category | No |
| `/en/world/` | `world_news_page` | World news category | No |
| `/en/technology/` | `technology_news_page` | Technology category | No |
| `/en/sport/` | `sport_news_page` | Sport category | No |
| `/en/contact-us/` | `contact_page` | Contact form | No |
| `/en/searchresult/?s=query` | `search_results` | Search across all languages | No |
| `/en/news/create/` | `news_create` | Create news article | Superuser |
| `/en/news/<slug>/edit/` | `news_update` | Edit news article | Superuser |
| `/en/news/<slug>/delete/` | `news_delete` | Delete news article | Superuser |
| `/en/adminpage/` | `admin_page` | Admin overview page | Superuser |
| `/en/account/login/` | `login` | Login page | No |
| `/en/account/logout/` | `logout` | Logout | Authenticated |
| `/en/account/signup/` | `user_register` | Register new account | No |
| `/en/account/dashboard/` | `user_profile` | User profile/dashboard | Authenticated |
| `/en/account/profile/edit/` | `edit_user_information` | Edit profile and photo | Authenticated |
| `/en/account/password-change/` | `password_change` | Change password | Authenticated |
| `/en/account/password-reset/` | `password_reset` | Password reset request | No |
| `/admin/` | — | Django admin panel | Superuser |

> Replace `/en/` with `/uz/` or `/ru/` to switch language.

---

## Language switching

The site uses Django's `i18n_patterns` and `LocaleMiddleware`.
Switch language by navigating to the language-prefixed URL:

| Language | URL prefix |
|---|---|
| English | `/en/` |
| Uzbek | `/uz/` |
| Russian | `/ru/` |

---

## Admin panel

Visit `/admin/` and log in with your superuser credentials.

From the admin panel you can:
- Create and manage `Category` records
- Create and publish `News` articles (set status to **Published** to make them visible)
- Moderate comments (enable/disable)
- View contact form submissions

> News articles default to **Draft** status and are not publicly visible until set to **Published**.

---

## Data models

### `news_app`

| Model | Fields |
|---|---|
| `Category` | `name` (+ `name_en`, `name_uz`, `name_ru` via modeltranslation) |
| `News` | `title`, `slug`, `body`, `image`, `category`, `publish_time`, `status` (Draft/Published) (+ translated `title_*`, `body_*`) |
| `Contact` | `name`, `email`, `message` |
| `Comment` | `news`, `user`, `body`, `created_time`, `active` |

### `accounts`

| Model | Fields |
|---|---|
| `Profile` | `user` (OneToOne → User), `photo`, `date_of_birth` |

---

## Project structure

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for a full annotated directory tree.

---

## SonarQube / SonarCloud

This project is configured for static code analysis.

### Setup

1. Sign up at [sonarcloud.io](https://sonarcloud.io) (free for public repos) or run a self-hosted SonarQube instance.
2. Add two GitHub repository secrets (`Settings → Secrets → Actions`):
   - `SONAR_TOKEN` — from your SonarQube/SonarCloud account
   - `SONAR_HOST_URL` — e.g. `https://sonarcloud.io`
3. Push to `main` — the `.github/workflows/sonarqube.yml` workflow triggers automatically.

### Local analysis

```bash
# Install sonar-scanner: https://docs.sonarqube.org/latest/analyzing-source-code/scanners/sonarscanner/
sonar-scanner \
  -Dsonar.token=YOUR_TOKEN \
  -Dsonar.host.url=YOUR_HOST_URL
```

---

## Development notes

### Regenerate translations after editing `.po` files

```bash
python manage.py compilemessages
```

### Update translation source files after adding new strings

```bash
python manage.py makemessages -l uz -l ru
python manage.py compilemessages
```

### Reset the database (development only)

```bash
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

### Email backend

Email is set to `console` backend by default — password reset emails print to the terminal instead of being sent. To use real email, update `settings.py`:

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.your-provider.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = config('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD')
```

---

## Production checklist

Before deploying to production:

- [ ] Set `DEBUG=False` in `.env`
- [ ] Set `SECRET_KEY` to a strong random value
- [ ] Set `ALLOWED_HOSTS` to your domain (e.g. `ALLOWED_HOSTS=yourdomain.com`)
- [ ] Run `python manage.py collectstatic`
- [ ] Use PostgreSQL instead of SQLite
- [ ] Configure a real email backend
- [ ] Serve behind Nginx or Apache with Gunicorn or uWSGI
- [ ] Set up HTTPS (Let's Encrypt / Certbot)
- [ ] Review Django's [deployment checklist](https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/)

---

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| Django | 4.1.7 | Web framework |
| Pillow | 10.0.0 | Image processing for uploads |
| whitenoise | 6.5.0 | Static file serving |
| django-modeltranslation | 0.18.11 | Multi-language model fields |
| django-hitcount | 1.3.5 | Article view counting |
| python-decouple | 3.8 | Environment variable management |
| django-etc | 1.4.0 | Django utilities |
| asgiref | 3.7.2 | ASGI support |
| sqlparse | 0.4.4 | SQL query formatting |
| tzdata | 2023.3 | Timezone database |
| typing_extensions | 4.7.1 | Backported type hints |

---

## License

This project is developed by [Arslonbek](https://github.com/Arslonbek13).
