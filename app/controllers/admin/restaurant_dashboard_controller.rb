class Admin::RestaurantDashboardController < ApplicationController

  layout "admin"

  def index
    @restaurant = Restaurant.find_by(:slug => params[:slug])
  end
end
