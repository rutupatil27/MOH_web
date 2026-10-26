# Database & API

## Entities
### Admin
username/email, passwordHash, createdAt, updatedAt

### Course
name, slug, shortDescription, description, levels, media, featured, sortOrder, published, timestamps

### GalleryItem
 title, image, category(optional), altText, sortOrder, published, timestamps

### Enquiry
name, phone, course, level, preferredContact, message, status, timestamps

### SiteSettings
academy name, contact details, address, social links, SEO defaults, approved public content

## Suggested public API
GET /api/courses
GET /api/courses/:slug
GET /api/gallery
POST /api/enquiries
GET /api/site-settings

## Suggested admin API
POST /api/admin/login
POST /api/admin/logout
GET /api/admin/enquiries
PATCH /api/admin/enquiries/:id
CRUD /api/admin/courses
CRUD /api/admin/gallery
GET/PATCH /api/admin/site-settings

Validate every write, protect admin endpoints, rate-limit login/enquiry endpoints, and never return password hashes.
