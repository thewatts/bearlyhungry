Wtpho::Application.routes.draw do
  resources :items
  resources :order_items
  resource  :session
  resources :users
  resources :orders

  delete 'session' => 'sessions#destroy', as: :logout
end
