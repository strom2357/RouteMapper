class AddDistanceAndElevation < ActiveRecord::Migration
  def change
  	add_column :rides, :distance, :float
  	add_column :rides, :elevation, :float
  end
end
