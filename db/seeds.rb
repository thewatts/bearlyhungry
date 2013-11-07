# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
categories = Category.create([{category: "Appetizers"},
                               {category: "House Specials"},
                               {category: "Deserts"},
                               {category: "Traditional Pho Soup"},
                               {category: "Extras"},
                               {category: "Vietnamese Noodle Bowls"},
                               {category: "Traditional Dishes"},
                               {category: "Boba Smoothies"},
                               {category: "Specialty Cocktails"},
                               {category: "Specialty Martinis"},
                               {category: "Regular Happy Hour (Monday-Friday)"},
                               {category: "Specialty Beers"},
                               {category: "Popular Wines"}
                              ])

user = Users.create([{full_name: "Franklin Webber", display_name: "", password_digest: "password",  email: "demo+franklin@jumpstartlab.com" }, {full_name: "Jeff", display_name: "j3", password_digest: "password", email: "demo+jeff@jumpstartlab.com"}, {full_name: "Katrina Owen", display_name: "kytrinyx", password_digest: "password", email: "demo+katrina@jumpstartlab.com"}])



require 'nokogiri'
require 'open-uri'

url = "http://www.pho95noodlehouse.com/pho-95-online-menu.html"
doc = Nokogiri::HTML(open(url))

items_data = doc.css("table.item")
items = items_data.map do |item|
  title = item.css("p.title").text.gsub(/[\d]+[\A-Z].\)*\ */, "").strip
  description = item.css("p.description").text
  price = item.css(".menu-price").text.sub('$', '').to_f.round(2)

  if !title.empty? && !description.empty? && price > 0
    Item.create(title: title, description: description, price: price)
  end
end.compact






