class RestaurantsController < ApplicationController

  def new
    @restaurant = Restaurant.new
  end

  def show
    @restaurant = Restaurant.find_by(slug: params[:restaurant_slug])
  end

  def create
    @restaurant = Restaurant.new(restaurant_params)
    if @restaurant.save
      @restaurant.add_owner(current_user)
      flash[:notice] = "Your Restaurant has been submitted for approval"
      redirect_to admin_restaurant_path(@restaurant.id)
    else
      flash[:error] = "Something went wrong"
      render :new
    end
  end

  private
  def restaurant_params
    params.require(:restaurant).permit(:name, :slug)
  end

end
