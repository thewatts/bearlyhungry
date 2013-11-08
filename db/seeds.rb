user = User.create([{full_name: "Franklin Webber", display_name: "", password_digest: "password",  email: "demo+franklin@jumpstartlab.com" }, {full_name: "Jeff", display_name: "j3", password_digest: "password", email: "demo+jeff@jumpstartlab.com"}, {full_name: "Katrina Owen", display_name: "kytrinyx", password_digest: "password", email: "demo+katrina@jumpstartlab.com"}])

require 'csv'

contents = CSV.open "./db/db_seed.csv", headers: true, header_converters: :symbol

contents.each do |row|

  title       = row[:title]
  description = row[:description]
  price       = row[:price]
  category    = row[:category]

  category_object = Category.create(title: category)
  item = Item.create(title: title, description: description, price: price)

  ItemCategory.create(category_id: category_object.id, item_id: item.id)
end



