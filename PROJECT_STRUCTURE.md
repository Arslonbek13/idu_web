# Project Structure

```
newsfeed_project_django/
│
├── manage.py                        # Django management entry point
├── requirements.txt                 # Python dependencies
├── .env                             # Environment variables (SECRET_KEY, DEBUG, ALLOWED_HOSTS)
├── .gitignore                       # Git exclusions
├── sonar-project.properties         # SonarQube / SonarCloud analysis config
├── AGENTS.md                        # AI agent safety rules
│
│── .github/
│   └── workflows/
│       └── sonarqube.yml            # CI: SonarQube analysis on push / PR
│
├── news_2/                          # Django project configuration package
│   ├── settings.py                  # All project settings (DB, apps, i18n, static, media)
│   ├── urls.py                      # Root URL dispatcher (admin + i18n_patterns)
│   ├── custom_permission.py         # OnlyLoggedSuperUser mixin (LoginRequired + is_superuser)
│   ├── wsgi.py                      # WSGI entry point for production servers
│   └── asgi.py                      # ASGI entry point (async support)
│
├── accounts/                        # User management app
│   ├── models.py                    # Profile model (OneToOne → User, photo, date_of_birth)
│   ├── views.py                     # register, dashboard, edit_user, user_login
│   ├── forms.py                     # LoginForm, UserRegistrationForm, UserEditForm, ProfileEditForm
│   ├── urls.py                      # /account/ URL patterns
│   ├── admin.py                     # Profile registration in Django admin
│   └── migrations/
│       └── 0001_initial.py          # Creates Profile table
│
├── news_app/                        # Main newsfeed app
│   ├── models.py                    # Category, News, Contact, Comment + PublishedManager
│   ├── views.py                     # All news views (home, list, detail, CRUD, search, categories)
│   ├── forms.py                     # ContactForm, CommentForm, SubscriptionForm
│   ├── urls.py                      # /en/, /uz/, /ru/ prefixed URL patterns
│   ├── admin.py                     # NewsAdmin, CategoryAdmin, CommentAdmin
│   ├── context_processor.py         # latest_news() — injects sidebar news + UI text into every template
│   ├── translation.py               # django-modeltranslation field registrations (title, body, name)
│   └── migrations/                  # 9 migrations covering full schema history
│       ├── 0001_initial.py
│       ├── 0002_contact.py
│       ├── 0003_alter_news_image.py
│       ├── 0004_alter_news_image.py
│       ├── 0005_alter_category_options_comment.py
│       ├── 0006_news_view_count.py
│       ├── 0007_remove_news_view_count.py
│       ├── 0008_news_body_en_..._title_en_and_more.py   # Translation fields
│       └── 0009_category_name_en_..._name_uz.py         # Category translation fields
│
├── templates/                       # All Django HTML templates (project-level)
│   ├── news/
│   │   ├── base.html                # Master layout: navbar, sidebar, footer, static links
│   │   ├── index.html               # Home page — featured + category sections
│   │   ├── news_list.html           # Full news list
│   │   ├── news_detail.html         # Single article + comments + hitcount
│   │   ├── search_result.html       # Search results page
│   │   ├── local.html               # Local news category page
│   │   ├── world.html               # World news category page
│   │   ├── technology.html          # Technology category page
│   │   ├── sport.html               # Sport category page
│   │   ├── contact.html             # Contact form page
│   │   └── 404.html                 # Custom 404 error page
│   ├── crud/
│   │   ├── news_create.html         # Superuser: create news article
│   │   ├── news_edit.html           # Superuser: edit news article
│   │   └── news_delete.html         # Superuser: delete confirmation
│   ├── account/
│   │   ├── register.html            # Registration form
│   │   ├── register_done.html       # Post-registration confirmation
│   │   └── profile_edit.html        # Edit user profile (name, email, photo, DOB)
│   ├── pages/
│   │   ├── user_profile.html        # Logged-in user dashboard
│   │   └── admin_page.html          # Superuser admin overview page
│   └── registration/                # Django built-in auth templates (overridden)
│       ├── login.html
│       ├── logged_out.html
│       ├── password_change_form.html
│       ├── password_change_done.html
│       ├── password_reset_form.html
│       ├── password_reset_done.html
│       ├── password_reset_confirm.html
│       ├── password_reset_complete.html
│       └── password_reset_email.html
│
├── static/                          # Source static assets (committed to git)
│   ├── css/
│   │   ├── style.css                # Main custom stylesheet
│   │   ├── modern.css               # Additional modern UI styles
│   │   ├── theme.css                # Theme overrides
│   │   ├── bootstrap.min.css        # Bootstrap 3
│   │   ├── font-awesome.min.css     # Font Awesome icons
│   │   ├── animate.css              # CSS animations
│   │   ├── slick.css                # Slick carousel styles
│   │   ├── font.css                 # Web font declarations
│   │   ├── jquery.fancybox.css      # Lightbox styles
│   │   └── li-scroller.css          # Ticker scroller styles
│   ├── js/
│   │   ├── custom.js                # Custom site JavaScript (ticker, preloader, interactions)
│   │   ├── adaptive-nav.js          # Responsive navigation logic
│   │   ├── jquery.min.js            # jQuery 1.x
│   │   ├── bootstrap.min.js         # Bootstrap JS
│   │   ├── slick.min.js             # Slick carousel
│   │   ├── wow.min.js               # Scroll animations
│   │   ├── html5shiv.min.js         # IE8 HTML5 polyfill
│   │   ├── respond.min.js           # IE8 media query polyfill
│   │   └── jquery.fancybox.pack.js  # Lightbox
│   ├── fonts/                       # FontAwesome + Bootstrap Glyphicons + web fonts
│   └── images/                      # Site images (logo, sliders, thumbnails)
│
├── locale/                          # Gettext translation files
│   ├── ru/LC_MESSAGES/
│   │   └── django.po                # Russian translations (source)
│   └── uz/LC_MESSAGES/
│       └── django.po                # Uzbek translations (source)
│
├── media/                           # User-uploaded files at runtime (NOT in git)
│   └── news/images/                 # News article images uploaded via admin
│
└── staticfiles/                     # Collected static files — generated by collectstatic (NOT in git)
```

---

## Key design notes

| Area | Detail |
|---|---|
| **Database** | SQLite (`db.sqlite3`) — fine for development, swap for PostgreSQL in production |
| **Static serving** | WhiteNoise with `CompressedManifestStaticFilesStorage` — serves compressed, fingerprinted files |
| **Multi-language** | `django-modeltranslation` adds `_en`, `_uz`, `_ru` columns; `LocaleMiddleware` + `i18n_patterns` route by prefix |
| **Auth** | Django built-in auth views; custom `OnlyLoggedSuperUser` mixin restricts CRUD to superusers |
| **Hit counting** | `django-hitcount` tracks per-article views without custom counter fields |
| **Context processor** | `news_app.context_processor.latest_news` injects sidebar news, categories, and UI copy into every template |
| **Time zone** | `Asia/Tashkent` (UTC+5) |
