class BuildSeedRestaurants
  include Sidekiq::Worker

  def perform(i, name, slug, status, city_id)
    r = Restaurant.create!(
      :name    => "#{name} #{i}",
      :slug    => "#{slug} #{i}",
      :status  => status,
      :city_id => city_id
    )
    users = User.limit(500).sample(100)
    create_items_for(r, name)
    create_jobs_for(r, users)

    if i % 50 == 0
      puts " "
      puts " "
      puts "============================================== Made #{i} Users"
      puts " "
      puts " "
    end
  end

  def create_items_for(r, name)
    original = Restaurant.find_by(name: name)
    original.items.each do |item|
      i = item.dup
      i.update(restaurant_id: r.id)
    end
  end

  def create_jobs_for(restaurant, users)
    2.times do
      restaurant.add_owner(users.sample)
      restaurant.add_stocker(users.sample)
      restaurant.add_cook(users.sample)
    end
  end

  def order_statuses
    ['pending', 'completed', 'being-prepared', 'ready']
  end

  def create_orders_for(restaurant, users)
    10.times do
      item = restaurant.items.sample
      order = restaurant.orders.create!(user: users.sample) 
      order.add_item(item.id, rand(5))
      order.update(status: order_statuses.rand)
    end
  end
end
