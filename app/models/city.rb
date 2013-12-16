class CityLocation < ActiveRecord::Base
  has_many :restaurants
end
