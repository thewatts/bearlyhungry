Wtpho::Application.routes.draw do
  
  # Home & Static Pages
  root "home_page#index"

  resources :restaurants

 # get 'menu'            => 'items#index'
  get 'menu/:category'  => 'items#index', as: "menu_category"
  get 'current-order'   => 'orders#current_order', as: "current_order"
  get 'my-orders'       => 'orders#index', as: "my_orders"
  put 'order/:id'       => 'admin/orders#update'
  get 'review-my-order' => 'charges#new', as: "review_order"
  put 'current-order'   => 'orders#update_current_order', 
    as: "update_current_order"
  get 'clear-order'     => 'orders#clear_order'
  get 'order-confirmation' => 'orders#confirmation', as: "order_confirmation"
  post 'order-confirmation' => 'users#update', as: "guest_to_user"
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

  # Charges
  resources :charges, only: [:create]
  get '/order-payment' => "charges#new", as: "order_payment"

  # Items
  resources :items, only: [:index, :show]

  # Order Items
  resources :order_items

  # Orders
  resources :orders, only: [:index, :show, :confirmation]

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
    get '/' => 'items#index', :as => 'root'
    get '/menu' => 'items#index', :as => 'menu'

    # Restaurant Admin
    namespace "admin" do
      resources :restaurants
      resources :items
      resources :order_items
      resources :customers, :controller => "users"
      resources :orders, as: :order
      put '/order-status/:status' => 'orders#update_status'
      patch '/item-availability' => 'items#toggle_availability',
        as: 'update_item_availability'
    end
  end

end
