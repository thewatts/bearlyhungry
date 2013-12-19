class HomePageController < ApplicationController
  layout "platform"

  def index
    @restaurants = Restaurant.limit(4)
  end

  def map_data
    cities = City.all
    data = cities.map { |city|
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-77.03, 38.90]
        },
        properties: {
          :title => city.city,
          :count => city.restaurants.count,
          :url => "http://google.com"
        }
      }
    }
    respond_to do |format|
      format.json do
        render json: {
          geoJson: data
        }.to_json
      end
    end
  end
end
