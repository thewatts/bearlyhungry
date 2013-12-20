require 'benchmark'
require 'csv'
require 'bcrypt'
require 'pry'

unencrypted_password = "password"
encrypted_password   = BCrypt::Password.create(unencrypted_password)

time = Benchmark.measure do

##############################################################################
# Counts for Models
##############################################################################
@user_num       = 10
@restaurant_num = 10

##############################################################################
# 30 Unique Locations (cities)
##############################################################################
#
puts "Creating Locations"
#
albuquerque  = City.create!(city: "Albuquerque")
anchorage    = City.create!(city: "Anchorage")
atlanta      = City.create!(city: "Atlanta")
austin       = City.create!(city: "Austin")
boston       = City.create!(city: "Boston")

boulder      = City.create!(city: "Boulder")
burlington   = City.create!(city: "Burlington")
charlotte    = City.create!(city: "Charlotte")
chicago      = City.create!(city: "Chicago")
cincinnati   = City.create!(city: "Cincinatti")

chicago      = City.create!(city: "Chicago")
dallas       = City.create!(city: "Dallas")
dc           = City.create!(city: "Washington, D.C.")
detroit      = City.create!(city: "Detriot")
denver       = City.create!(city: "Denver")

honolulu     = City.create!(city: "Honolulu")
la           = City.create!(city: "Los Angeles")
little_rock  = City.create!(city: "Little Rock")
madison      = City.create!(city: "Madison")
miami        = City.create!(city: "Miami")

minneapolis  = City.create!(city: "Minneapolis")
nyc          = City.create!(city: "New York City")
philadelphia = City.create!(city: "Philadelphia")
pittsburgh   = City.create!(city: "Pittsburgh")
portland     = City.create!(city: "Portland")

san_diego    = City.create!(city: "San Diego")
santa_fe     = City.create!(city: "Santa Fe")
seattle      = City.create!(city: "Seattle")
sanfran      = City.create!(city: "San Francisco")
tucson       = City.create!(city: "Tucson")

cities = [
  albuquerque, anchorage, atlanta, austin, boston, boulder, burlington,
  charlotte, chicago, cincinnati, chicago, dallas, dc, detroit, denver,
  honolulu, la, little_rock, madison, miami, minneapolis, nyc, philadelphia,
  pittsburgh, portland, san_diego, santa_fe, santa_fe, seattle, sanfran, tucson
]

restaurant_statuses = %w( approved pending rejected )


##############################################################################
# ROLES
##############################################################################
#
puts "Creating Roles"
#
Role.create!([{ name: "Owner"}])
Role.create!([{ name: "Stocker"}])
Role.create!([{ name: "Cook"}])

##############################################################################
# USERS
##############################################################################
#
puts "Creating Normal Users"
#
jorge = User.create!(email: "demo+jorge@jumpstartlab.com",
    full_name: "Jorge",
    display_name: "littlemexican",
    password: unencrypted_password,
    password_confirmation: unencrypted_password,
    admin_status: true)

jeff = User.create!(email: "demo+jeff@jumpstartlab.com",
  full_name: "Jeff",
  display_name: "j3",
  password: unencrypted_password,
  password_confirmation: unencrypted_password,
  admin_status: true)

katrina = User.create!(email: "demo+katrina@jumpstartlab.com",
    full_name: "Katrina Owen",
    display_name: "kytrynx",
    password: unencrypted_password,
    password_confirmation: unencrypted_password,
    admin_status: true)

kat = User.create!(email: "katrina@engelsted.co",
    full_name: "Katrina Engelsted",
    display_name: "mapppingkat",
    password: unencrypted_password,
    password_confirmation: unencrypted_password,
    admin_status: false)

luke = User.create!(email: "lukemartinez@gmail.com",
  full_name: "Luke",
  display_name: "Lukey",
  password: unencrypted_password,
  password_confirmation: unencrypted_password,
  admin_status: false)

nathaniel = User.create!(email: "watts@nathanielwatts.com",
  full_name: "Nathaniel",
  display_name: "thewatts",
  password: unencrypted_password,
  password_confirmation: unencrypted_password,
  admin_status: true)

def seed_users(count)
  puts "Creating Dynagen Users"
  count.times.map do |i|
    print "."
    User.create!(
      :full_name             => "user_number_#{i}",
      :display_name          => "user_#{i}",
      :email                 => "user_#{i}@example.com",
      :password              => "unencrypted_password",
      :password_confirmation => "unencrypted_password"
    )
  end
end

#seed_users(100000)
@all_users       = seed_users(@user_num)
@all_users_count = @user_num

##############################################################################
# BASE RESTAURANTS
##############################################################################
#
puts "Creating Base Restaurants"
#

jamba_juice = Restaurant.create!(name: "Jamba Juice",
  description: "Feel health drain down your throat", slug: "jamba-juice",
  status: "approved", city_id: austin.id, logo: "https://s3.amazonaws.com/bearlyhungry/jamba.jpg" )

luke = Restaurant.create!(name: "Luke",
  description: "The finest airport cuisine around", slug: "luke",
  status: "approved", city_id: tucson.id, logo: "https://s3.amazonaws.com/bearlyhungry/lukes.png" )

nathaniels_nook = Restaurant.create!(name: "Nathaniel's Nook",
  description: "A place to get caffineated and fat, while eating omelettes", slug: "nathaniels-nook",
  status: "approved", city_id: nyc.id, logo: "https://s3.amazonaws.com/bearlyhungry/nath.png" )

kats_hot_cakes = Restaurant.create!(name: "Kat's Hot Cakes",
  description: "BEARkfast ALL DAY LONG", slug: "kats-hot-cakes",
  status: "approved", city_id: boston.id, logo: "https://s3.amazonaws.com/bearlyhungry/kats.png" )

chicago_pizza = Restaurant.create!(name: "Chicago Pazzari",
  description: "Yum Pizza.", slug: "chicago-pazzari",
  status: "approved", city_id: portland.id, logo: "https://s3.amazonaws.com/bearlyhungry/pazzari.png" )

what_the_pho = Restaurant.create!(name: "What The Pho",
  description: "Pho-Nominal Food!", slug: "what-the-pho",
  status: "approved", city_id: seattle.id , logo: "https://s3.amazonaws.com/bearlyhungry/wtpho.png")

taco_bell = Restaurant.create!(name: "Taco Bell",
  description: "For the Mexican in you", slug: "taco-bell",
  status: "approved", city_id: sanfran.id, logo: "https://s3.amazonaws.com/bearlyhungry/tacobell.jpg")

ventus = Restaurant.create!(name: "Ventus",
  description: "A perfect date place", slug: "ventus",
  status: "approved", city_id: dc.id, logo: "https://s3.amazonaws.com/bearlyhungry/ventus.jpg" )

mcdonalds = Restaurant.create!(name: "Mcdonalds",
  description: "A task of beautiful Americano cuisine", slug: "mcdonalds",
  status: "approved", city_id: denver.id, logo:"https://s3.amazonaws.com/bearlyhungry/mcdon.jpg")

lukes_lobster = Restaurant.create!(name: "Luke's Lobster",
  description: "Lobsters to make you poop red", slug: "lukes-lobster",
  status: "approved", city_id: portland.id, logo: "https://s3.amazonaws.com/bearlyhungry/luke.png" )

restaurants = [ what_the_pho, mcdonalds, jamba_juice, chicago_pizza,
                kats_hot_cakes, luke, nathaniels_nook, taco_bell,
                ventus, lukes_lobster ]

## ____________________20 different items per restaurant______________________
#
def create_items_for(restaurant)
  puts "================================== Creating Items, Categories, and ItemCategories for #{restaurant.name}"
  filename = restaurant.slug.gsub(/-\d+/, '')
  contents = CSV.open "./db/seed/items/#{filename}-items.csv", headers: true, header_converters: :symbol

   contents.each do |row|
     print "."
     title           = row[:title]
     description     = row[:description]
     category        = row[:category]
     price           = row[:price]
     image_file_name = row[:image_file_name]

     # create category
     category_object = Category.find_or_create_by(title: category, type_of: 'main_menu')

     # create item
     item = Item.create!(
       title: title,
       description: description,
       price: price,
       image_file_name: image_file_name,
       restaurant_id: restaurant.id
     )
      
     ItemCategory.create!(category_id: category_object.id, item_id: item.id)
   end
end

def create_jobs_for(restaurant)
  2.times do
    binding.pry if !restaurant.valid?
    restaurant.add_owner(@all_users[rand(@all_users_count)])
    restaurant.add_stocker(@all_users[rand(@all_users_count)])
    restaurant.add_cook(@all_users[rand(@all_users_count)])
  end
end

def order_statuses
  ['pending', 'completed', 'being-prepared', 'ready']
end

def create_orders_for(restaurant)
  puts "Creating Orders for #{restaurant.name}"
  10.times do
    item = restaurant.items.sample
    order = restaurant.orders.create!(user: @all_users[rand(@all_users_count)])
    order.add_item(item.id, rand(5))
    order.update(status: order_statuses[rand(5)])
  end
end

restaurants.each do |restaurant|
  puts "creating items for #{restaurant.name}"
  create_items_for(restaurant)
  puts "creating job for #{restaurant.name}"
  create_jobs_for(restaurant)
  puts "creating orders for #{restaurant.name}"
  create_orders_for(restaurant)
end

##############################################################################
# AUTO GEN RESTAURANTS
##############################################################################
#
puts "Creating DYNAGEN Restaurants"
#
def clone_restaurant(restaurant, cities, count)
  count.times do |i|
    print "."

    r = restaurant.dup

    r.update(
      name: restaurant.name + " #{i}",
      status: restaurant.status,
      slug: restaurant.slug + "-#{i}",
      city: cities[rand(30)]
    )

    create_items_for(r)
    create_jobs_for(r)
    create_orders_for(r)
  end
end

restaurants.each { |r| clone_restaurant(r, cities, @restaurant_num) }
##_________________________images______________________________
#images = File.open "./app/assets/images"
end
puts "Time to seed:"
puts time

