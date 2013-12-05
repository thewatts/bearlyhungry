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
    patch '/item-availability' => 'items#toggle_availability', as: 'update_item_availability'

    delete 'user' => 'users#destroy'
  end

  resources :charges
  resources :items, only: [:index, :show]
  resources :order_items
  resource  :session
  resources :users,  only: [:new, :create, :show, :edit, :update]
  resources :orders, only: [:index, :show]

  get '/login'  => 'sessions#index'
  post '/login' => 'sessions#create'
  get '/logout' => 'sessions#destroy'
end
