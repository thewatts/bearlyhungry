class City < ActiveRecord::Base
  has_many :restaurants

CITIES = [ 
'Albuquerque', 'Anchorage', 'Atlanta',
'Austin',
'Boston',
'Boulder',
'Burlington',
'Charlotte',
'Chicago',
'Cincinnati',
'Chicago',
'Dallas',
'DC',
'Detroit',
'Denver',
'Honolulu',
'LA',
'Little_rock',
'Madison','Miami','Minneapolis','NYC',
'Philadelphia','Pittsburgh',
'Portland','San Diego',
'Santa Fe','Seattle',
'San Fransico','Tucson'
]

  def self.cities_selection
     self.all.each_with_object([]) do |record, array|
       array << [record.city, record.id]
     end
  end  
end
