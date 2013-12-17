class RestaurantsController < ApplicationController

  def new
    @restaurant = Restaurant.new
  end

  def show
    @restaurant = Restaurant.find_by(slug: params[:slug])
  end

  def create
    begin
      @restaurant = Restaurant.create_with_owner(restaurant_params, current_user)
      flash[:notice] = "Successfully Created your Restaurant"
      redirect_to restaurant_admin_root_path(@restaurant.slug)
    rescue ActiveRecord::RecordInvalid => e
      @restaurant = e.record
      render :new
    end
  end

  private
  def restaurant_params
    params.require(:restaurant).permit(:name, :slug)
  end

end
