Wtpho::Application.routes.draw do
  get '/menu' => 'items#index'
  get '/menu/:category' => 'items#index'
  get '/current_order' => 'orders#show'
  get '/my_orders' => 'orders#index'
  put '/order/:id' => 'admin/orders#update'


  namespace "admin" do
    resources :items
    resources :order_items
    resource  :session
    resources :users
    resources :orders, as: :order
    delete 'user' => 'users#destroy'
  end

  resources :items, only: [:index, :show]
  resources :order_items
  resource  :session
  resources :users
  # resources :orders, only: [:show]

  get '/' => "items#index"

  delete 'session' => 'sessions#destroy', as: :logout
end
