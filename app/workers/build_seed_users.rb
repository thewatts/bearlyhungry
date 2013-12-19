class BuildSeedUsers
  include Sidekiq::Worker

  def perform(num)
    User.create(
      :full_name             => "user_number_#{num}",
      :display_name          => "user_#{num}",
      :email                 => "user_#{num}@example.com",
      :password              => "password",
      :password_confirmation => "password"
    )
    if num % 100 == 0
      puts " "
      puts " "
      puts "============================================== Made #{num} Users"
      puts " "
      puts " "
    end
  end
end
