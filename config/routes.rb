Wtpho::Application.routes.draw do
  resources :items
  resources :order_items
  resource :session
  delete '/order_items/:id' => 'order_items#destroy', as: "delete_order_item"
  get "order" => "order#show"
  delete 'session' => 'sessions#destroy', as: :logout
end
