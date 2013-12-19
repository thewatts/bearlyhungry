class HomePageController < ApplicationController
  layout "platform"

  def index
    @restaurants = Restaurant.limit(10)
  end

  def map_data
    @cities = City.all
    # data = cities.map { |city|
    #   {
    #     :name => city.city,
    #     :count => city.restaurants.count,
    #     :url => "http://google.com"
    #   }
    # }
    respond_to do |format|    
      format.json { render :json => @cities.to_json(:only => [:cities, :coordinates]) }
    end
  end
end
