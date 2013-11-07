Wtpho::Application.routes.draw do
  resources :items
  resources :order_items
  get "order" => "order#show"
end
