Wtpho::Application.routes.draw do
  resources :items
  resources :order_items
  resource  :session
  resources  :users

  get "order" => "orders#show"
  delete 'session' => 'sessions#destroy', as: :logout
end
