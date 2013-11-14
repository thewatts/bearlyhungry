Wtpho::Application.routes.draw do

  root "items#index"

  get '/menu'            => 'items#index'
  get '/menu/:category'  => 'items#index', as: "menu_category"
  get '/current-order'   => 'orders#current_order', as: "current_order"
  get '/my-orders'       => 'orders#index', as: "my_orders"
  put '/order/:id'       => 'admin/orders#update'
  get '/review-my-order' => 'charges#new', as: "review_order"
  put '/current-order'   => 'orders#update_current_order', as: "update_current_order"
  get '/clear-order'     => 'orders#clear_order'

  namespace "admin" do
    resources :items
    resources :order_items
    resource  :session
    resources :users
    resources :orders, as: :order
    put '/order-status/:status' => 'orders#update_status'

    delete 'user' => 'users#destroy'
  end

  resources :charges
  resources :items, only: [:index, :show]
  resources :order_items
  resource  :session
  resources :users,  only: [:new, :create, :show, :edit]
  resources :orders, only: [:index, :show]

  get '/login'  => 'sessions#create', as: :login
  get '/logout' => 'sessions#destroy', as: :logout
end
