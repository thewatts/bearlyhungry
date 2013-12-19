class Super::RestaurantsController < ApplicationController
  layout "super"

  def index
    @cities = cities_with_restaurants
    if params[:filter]
      @restaurants = Restaurant.where(city_id: params[:filter]).page(params[:page])
    else
      @restaurants = Restaurant.all.page(params[:page]) 
    end
  end

  def show
    @restaurant = Restaurant.find_by(:slug => params[:slug])
  end

  def update
    restaurant = Restaurant.find_by(:slug => params[:slug])
    restaurant.update(status: params[:status])
    restaurant.email_response
    redirect_to :back
  end
end
