Rails.application.routes.draw do
	root to: 'static_pages#root'	

  resources :users, only: [:new, :create]
  resources :sessions, only: [:new, :create, :destroy]

  namespace :api, defaults: { format: :json } do
	  resources :rides, only: [:new, :create, :index]
	end
end
