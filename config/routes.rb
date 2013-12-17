Wtpho::Application.routes.draw do

  # Home & Static Pages
  root "home_page#index"

  resources :restaurants

  # post 'order-confirmation' => 'users#guest_to_user', as: "guest_to_user"

  # Platform Admin // Super
  scope :path => "admin", :as => "overlord" do
    resources :items
    resources :order_items
    resource  :session
    resources :users
    resources :orders, as: :order
    put '/order-status/:status' => 'orders#update_status'
    patch '/item-availability' => 'items#toggle_availability',
      as: 'update_item_availability'
    resources :restaurants, :param => :slug
  end

  # Users
  resources :users,  only: [:new, :create, :show, :destroy]
  put '/user' => 'users#update'

  # Session
  resource  :session
  get '/login'  => 'sessions#index'
  post '/login' => 'sessions#create'
  get '/logout' => 'sessions#destroy'

  # Restaurant Pages
  scope :path => ":slug", :as => "restaurant" do

    # Restaurant Home & Menu
    get '/'               => 'items#index', :as => 'root'
    get '/menu'           => 'items#index', :as => 'menu'
    get '/menu/:category' => 'items#index', :as => "menu_category"

    # Items
    resources :items, only: [:index, :show]

    # Order Items
    resources :order_items

    # Charges
    resources :charges, only: [:create]
    get '/order-payment' => "charges#new", as: "order_payment"

    # Orders
    resources :orders, only: [:index, :show, :confirmation]
    get 'current-order'          => 'orders#current_order', as: "current_order"
    get 'order-history'          => 'orders#index', as: "order_history"
    put 'order/:id'              => 'admin/orders#update'
    put 'current-order'          => 'orders#update_current_order',
      as: "update_current_order"
    get 'clear-order'            => 'orders#clear_order'

    # Payment
    get 'review-my-order' => 'charges#new', as: "review_order"

    # Order Confirmation
    get 'order-confirmation' => 'orders#confirmation', as: "order_confirmation"
    post 'order-confirmation' => 'users#update', as: "guest_to_user"

    # Restaurant Admin
    namespace "admin" do
      # Dashboard
      get '/'  => 'restaurant_dashboard#index', :as => "root"
      resources :restaurants
      resources :items
      resources :order_items
      resources :customers, :controller => "users"
      resources :orders
      put '/order-status/:status' => 'orders#update_status'
      patch '/item-availability' => 'items#toggle_availability',
        as: 'update_item_availability'
    end
  end

end
