# Kế hoạch Migration: smartphone-market-fe → Flutter

> **Mục tiêu:** Migrate toàn bộ chức năng từ React/TypeScript FE sang Flutter app (smartphone_market).

---

## 1. Tổng quan hiện trạng

### 1.1 smartphone-market-fe (React/TypeScript)

| Thành phần | Chi tiết |
|------------|----------|
| **Auth** | Login, Register, AuthContext, RequireShop guard |
| **Posts** | FeedPage (mock data), PostDetailPage (mock), CreatePostWizardPage (7 bước, chưa gọi API thật) |
| **API** | `apiFetch`, `postsApi` (uploadImage, createPost), env config |
| **Layout** | AppShell, BottomNav, TopBar, FiltersBar, SearchBar |
| **State** | Zustand (filters), AuthContext |
| **Meta** | Brands, Models, Locations từ BE (dùng trong CreatePost) |

### 1.2 smartphone-market-be (API)

| Endpoint | Method | Auth | Mô tả |
|----------|--------|------|-------|
| `/api/users` | POST | ❌ | Đăng ký |
| `/api/users/login` | POST | ❌ | Đăng nhập |
| `/api/posts` | GET | ❌ | Danh sách tin (cursor, filters) |
| `/api/posts/:id` | GET | ❌ | Chi tiết tin |
| `/api/posts` | POST | ✅ | Tạo tin mới |
| `/api/meta/brands` | GET | ❌ | Danh sách hãng |
| `/api/meta/models?brand=&q=` | GET | ❌ | Models theo hãng |
| `/api/meta/locations` | GET | ❌ | Tỉnh/thành + quận/huyện |
| `/api/uploads` | POST | ✅ | Upload ảnh (multipart) |

### 1.3 smartphone_market (Flutter) – hiện tại

| Đã có | Chưa có |
|-------|---------|
| Auth (login, register) | Posts API, Meta API, Upload API |
| ApiClient, TokenStorage, AuthInterceptor | FeedPage thật (đang dùng Placeholder) |
| Riverpod, GoRouter | PostDetailPage thật |
| Router với auth redirect `/post/new` | CreatePostWizard 7 bước |
| image_picker | Layout: BottomNav, TopBar, FiltersBar |
| | Filters state (Zustand → Riverpod) |

---

## 2. Mapping FE → Flutter

| FE (React) | Flutter |
|------------|---------|
| `apiFetch` | `ApiClient` (Dio) – đã có |
| `AuthContext` | `AuthController` (Riverpod) – đã có |
| `useFilters` (Zustand) | `FiltersNotifier` (Riverpod) |
| `postsApi` | `PostsApi` class mới |
| Meta (brands, models, locations) | `MetaApi` class mới |
| `uploadImage` | `UploadsApi` class mới |
| `CreatePostWizardPage` 7 steps | 7 màn hình/screen trong PageView |
| `PostCard`, `PostDetailPage` | Widget tương ứng |
| `AppShell`, `BottomNav`, `TopBar` | Scaffold + BottomNavigationBar + AppBar |

---

## 3. Plan chi tiết theo phase

### Phase 1: Core & Data Layer (1–2 ngày)

#### 1.1 Models & DTOs

- [ ] `lib/features/posts/data/post_models.dart`
  - `PostListItemDto`, `PostDetailDto`, `PostImageDto`, `SellerDto`
  - `PagedResult<T>`, `CreatePostCommand`, `CreatePostImageInput`
  - Map enum: `PostType`, `PostImageKind` (theo BE)
- [ ] `lib/features/meta/data/meta_models.dart`
  - `LocationDto` (province + districts)
  - Response types cho brands, models

#### 1.2 API Services

- [ ] `lib/features/posts/data/posts_api.dart`
  - `getPosts(GetPostsQuery)` → `PagedResult<PostListItemDto>`
  - `getPostById(String id)` → `PostDetailDto?`
  - `createPost(CreatePostCommand)` → `String` (post id)
- [ ] `lib/features/meta/data/meta_api.dart`
  - `getBrands()` → `List<String>`
  - `getModels(brand, q?)` → `List<String>`
  - `getLocations()` → `List<LocationDto>`
- [ ] `lib/features/uploads/data/uploads_api.dart`
  - `uploadImage(File file)` → `{ key, publicUrl }`

#### 1.3 Endpoints

- [ ] Cập nhật `lib/core/api/endpoints.dart` (đã có auth, thêm posts, meta, uploads)

---

### Phase 2: State Management (0.5–1 ngày)

#### 2.1 Filters

- [x] `lib/app/store/filters_state.dart`
  - State: q, province, district, brand, model, minPrice, maxPrice, cosmetic, batteryMin, sort
  - `FiltersNotifier` với `set`, `reset`
- [ ] Sync URL (optional): tương đương `useUrlSyncFilters` nếu cần deep link

#### 2.2 Posts

- [x] `lib/features/posts/state/posts_provider.dart`
  - `postsListProvider` (FutureProvider với query params từ filters)
  - `postDetailProvider(id)` (FutureProvider)
- [x] `lib/features/posts/state/create_post_state.dart`
  - State cho wizard: step, form data, loading, error

---

### Phase 3: UI – Feed & Post Detail (1–2 ngày)

#### 3.1 Layout

- [x] `lib/shared/layout/app_shell.dart`
  - Scaffold với BottomNavigationBar (Feed, Đăng tin, Tài khoản)
  - AppBar với SearchBar
- [x] `lib/shared/layout/filters_bar.dart`
  - Dropdown/filter: province, brand, price range, sort
- [x] `lib/shared/ui/search_bar.dart` (AppSearchBar)

#### 3.2 FeedPage

- [x] Thay `PlaceholderPage('Feed')` bằng `FeedPage` thật
- [x] Gọi `postsListProvider`, hiển thị `PostCard` list
- [x] Pull-to-refresh, load more (cursor – chưa load more)
- [x] Empty state, loading state

#### 3.3 PostCard

- [x] `lib/features/posts/ui/post_card.dart`
  - Thumbnail, brand, model, price, location, timeAgo
  - Badge: Cửa hàng/Cá nhân, Uy tín, Trung gian
  - Navigate to `/posts/:id`

#### 3.4 PostDetailPage

- [x] Thay placeholder bằng màn hình chi tiết thật
- [x] Gallery ảnh, thông tin tin, seller card
- [x] CTA: Chat, Gọi điện, Mua qua trung gian (nếu escrow)
- [x] Mô tả

#### 3.5 Utils

- [x] `lib/shared/utils/money.dart` – format VND
- [x] `lib/shared/utils/time_ago.dart` – thời gian tương đối
- [x] `lib/shared/utils/normalize.dart` – chuẩn hóa chuỗi tìm kiếm

---

### Phase 4: Create Post Wizard (2–3 ngày)

#### 4.1 Cấu trúc

- [x] `lib/features/posts/ui/create_post_wizard/`
  - 7 màn con với StepHeader, StepFooter
  - Form state: `CreatePostFormState` (create_post_state.dart)

#### 4.2 7 bước (tương ứng FE)

| Step | FE Component | Flutter Screen |
|------|--------------|----------------|
| 1 | StepType | `StepTypeScreen` – Sell/Buy |
| 2 | StepBrand | `StepBrandScreen` – Brands từ Meta API |
| 3 | StepModel | `StepModelScreen` – Models theo brand |
| 4 | StepPrice | `StepPriceScreen` – storageGb, price |
| 5 | StepCondition | `StepConditionScreen` – cosmetic, screen, battery, origin, location |
| 6 | StepImages | `StepImagesScreen` – image_picker, upload |
| 7 | StepEscrow + StepDescription | `StepEscrowDescriptionScreen` |

#### 4.3 Logic

- [x] Validate từng bước trước khi next
- [x] Upload ảnh trước khi submit (Step 6 → submit)
- [x] Map form → `CreatePostCommand` (PostType, PostImageKind)
- [x] Gọi `createPost` → navigate về Feed
- [x] Xử lý lỗi (validation, network)

#### 4.4 Lưu ý mapping FE → BE

- FE schema có nhiều field condition (cosmetic, screen, batteryPercent, v.v.) nhưng **CreatePostCommand hiện tại chỉ có**: Type, UserId, Brand, Model, StorageGb, Price, Province, District, EscrowEnabled, Description, Images.
- Có thể:
  - **Option A:** Chỉ gửi các field BE hỗ trợ (bỏ condition chi tiết ở bước 5 hoặc lưu vào Description).
  - **Option B:** Mở rộng BE để nhận Cosmetic, Screen, BatteryPercent, v.v. (cần sửa CreatePostCommand + Handler).

---

### Phase 5: Auth Guard & Polish (0.5–1 ngày)

#### 5.1 RequireShop

- [x] Route `/post/new` đã có redirect: login nếu chưa auth, về `/` nếu không phải shop
- [x] Kiểm tra `auth.isShop` từ `AuthState`

#### 5.2 BottomNav

- [x] Tab "Đăng tin" chỉ hiện với user role Shop
- [x] Tab "Tài khoản": Login/Register nếu chưa đăng nhập, Profile/Logout nếu đã đăng nhập

#### 5.3 Error handling

- [x] Global error handler cho Dio (ErrorInterceptor + AuthInterceptor)
- [x] SnackBar cho lỗi network qua ErrorInterceptor
- [x] Retry khi load posts fail (FeedPage có nút Thử lại)

#### 5.4 Config

- [x] Base URL: `lib/core/config/app_config.dart` (dart-define: API_BASE_URL)
- [x] Default: Android 10.0.2.2:8081, khác localhost:8081

---

## 4. Cấu trúc thư mục Flutter đề xuất

```
lib/
├── main.dart
├── app/
│   ├── app.dart
│   ├── router.dart
│   └── store/
│       └── filters_state.dart
├── core/
│   ├── api/
│   │   ├── api_client.dart
│   │   ├── auth_interceptor.dart
│   │   └── endpoints.dart
│   ├── providers.dart
│   └── storage/
│       └── token_storage.dart
├── features/
│   ├── auth/
│   │   ├── data/
│   │   ├── state/
│   │   └── ui/
│   ├── posts/
│   │   ├── data/
│   │   │   ├── post_models.dart
│   │   │   └── posts_api.dart
│   │   ├── state/
│   │   └── ui/
│   │       ├── feed_page.dart
│   │       ├── post_detail_page.dart
│   │       ├── post_card.dart
│   │       └── create_post_wizard/
│   │           ├── create_post_wizard_page.dart
│   │           ├── step_type_screen.dart
│   │           ├── step_brand_screen.dart
│   │           ├── ...
│   │           └── step_escrow_description_screen.dart
│   ├── meta/
│   │   └── data/
│   │       ├── meta_models.dart
│   │       └── meta_api.dart
│   └── uploads/
│       └── data/
│           └── uploads_api.dart
└── shared/
    ├── layout/
    │   ├── app_shell.dart
    │   ├── bottom_nav.dart
    │   ├── top_bar.dart
    │   └── filters_bar.dart
    └── utils/
        ├── money.dart
        ├── time_ago.dart
        └── normalize.dart
```

---

## 5. Thứ tự thực hiện đề xuất

1. **Phase 1** – Models, API services, endpoints
2. **Phase 2** – Filters state, posts providers
3. **Phase 3** – Layout, FeedPage, PostCard, PostDetailPage
4. **Phase 4** – Create Post Wizard (7 bước)
5. **Phase 5** – Auth guard, BottomNav logic, error handling, config

---

## 6. Ghi chú kỹ thuật

### 6.1 Enum mapping FE ↔ BE

| FE | BE (C#) | Flutter |
|----|---------|---------|
| "sell" / "buy" | PostType.Sell=1, Buy=2 | enum PostType { sell, buy } |
| "front","back",... | PostImageKind.Front=1,... | enum PostImageKind |
| "99","95","90","lt90" | CosmeticGrade | enum CosmeticGrade |

### 6.2 CreatePost payload

- BE nhận `userId` (Guid) – Flutter cần lấy từ `AuthState.user.id` sau login.
- Images: upload từng ảnh → lấy `publicUrl` → gửi trong `CreatePostCommand.Images` với `Kind`, `Url`, `SortOrder`.

### 6.3 Cursor pagination

- `GetPostsQuery` trả `PagedResult<PostListItemDto>` với `NextCursor`.
- Flutter: dùng `NextCursor` làm param cho request tiếp theo khi load more.

---

## 7. Ước lượng thời gian

| Phase | Thời gian |
|-------|-----------|
| Phase 1 | 1–2 ngày |
| Phase 2 | 0.5–1 ngày |
| Phase 3 | 1–2 ngày |
| Phase 4 | 2–3 ngày |
| Phase 5 | 0.5–1 ngày |
| **Tổng** | **5–9 ngày** |

---

*Tài liệu được tạo dựa trên phân tích cấu trúc smartphone-market-fe, smartphone-market-be và smartphone_market (Flutter).*
