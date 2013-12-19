class HomePageController < ApplicationController
  layout "platform"

  def index
    @restaurants = Restaurant.limit(4)
    @data = city_map_data
  end

  def map_data
    respond_to do |format|
      format.json do
        render json: {
          cities: city_map_data
        }.to_json
      end
    end
  end

  def city_map_data
    cities = City.all
    cities.map do |city|
      if city.restaurants.count > 0
        {
          :type => "Feature",
          :properties => {
            :name  => city.city,
            :count => city.restaurants.count,
            :slug  => "http://google.com"
          },
          :geometry => {
            :type => "Point",
            :coordinates => city.coordinates
          }
        }
      end
    end.compact
  end
end
