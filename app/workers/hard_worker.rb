class HardWorker
  include Sidekiq::Worker

  def perform(i)
  end
end
