desc "PUNCHING BABIES."
task :seed_users => :environment do
  100.times do |i|
    BuildSeedUsers.perform_async(i)
    puts "creating user #{i}"
  end
end
