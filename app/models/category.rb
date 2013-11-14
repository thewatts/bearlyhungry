class Category < ActiveRecord::Base
  validates_uniqueness_of :title

  has_many :item_categories
  has_many :items, through: :item_categories

  def slug
    title.downcase.strip.gsub(/^ \W/, '').gsub(' ', '-')
  end

  def self.find_by_slug(param)
    if param
      title = param.gsub('-', ' ').titleize
      find_by(title: title)
    end
  end
end
