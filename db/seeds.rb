# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

require 'rubygems'
require 'nokogiri'
require 'open-uri'
require 'pry'

url = "http://www.pho95noodlehouse.com/pho-95-online-menu.html"
doc = Nokogiri::HTML(open(url))

#   def initialize(title,description, price)
#     @title = title
#     @description = description
#     @price = price
#   end

#   attr_reader :title, :description, :price
# end

items_data = doc.css("table.item")
items = items_data.map do |item|
  title = item.css("p.title").text.gsub(/[\d]+[\A-Z].\)*\ */, "").strip
  description = item.css("p.description").text
  price = item.css(".menu-price").text.sub('$', '').to_f.round(2)

  if !title.empty? && !description.empty? && price > 0
    Item.create(title: title, description: description, price: price)
  end
end.compact

items.each do |item|
  puts item.title
  puts item.description
  puts item.price
  puts "---"
end

