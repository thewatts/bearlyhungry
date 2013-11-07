Wtpho::Application.routes.draw do
  resources :items
  resources :order_items
  delete '/order_items/:id' => 'order_items#destroy', as: "delete_order_item"
  get "order" => "order#show"
end
