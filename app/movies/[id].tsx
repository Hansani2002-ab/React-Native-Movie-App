import { icons } from '@/constants/icons';
import { fetchMovieDetails } from '@/services/api';
import useFetch from '@/services/useFetch';
import { ResizeMode, Video } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// MovieInfo component
interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-white font-normal text-sm">{label}</Text>
    <Text className="text-white font-bold text-sm mt-2">
      {value || 'N/A'}
    </Text>
  </View>
);

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [playVideo, setPlayVideo] = useState(false);

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );

  if (loading || !movie) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* 🎬 Poster / Video Section */}
        {!playVideo ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setPlayVideo(true)}
          >
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
              }}
              className="w-full h-[550px]"
              resizeMode="cover"
            />

            {/* ▶ Play Button Overlay */}
            <View className="absolute inset-0 justify-center items-center">
              <View className="bg-black/60 p-5 rounded-full">
                <Image
                  source={icons.play}
                  className="w-10 h-10"
                  tintColor="#fff"
                />
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <Video
            source={{
              uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            }}
            style={{ width: '100%', height: 300 }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
          />
        )}

        {/* Movie Details */}
        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">
            {movie.title}
          </Text>

          <View className="flex-row items-center gap-x-2 mt-2">
            <Text className="text-white text-sm">
              {movie.release_date?.split('-')[0]}
            </Text>
            <Text className="text-white text-sm">
              {movie.runtime}m
            </Text>
          </View>

          {/* Rating */}
          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {Math.round(movie.vote_average ?? 0)}/10
            </Text>
            <Text className="text-white text-sm">
              ({movie.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie.overview} />
          <MovieInfo
            label="Genres"
            value={movie.genres?.map((g) => g.name).join(', ')}
          />

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie.budget / 1_000_000).toFixed(1)} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${(movie.revenue / 1_000_000).toFixed(1)} million`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={movie.production_companies
              ?.map((c) => c.name)
              .join(', ')}
          />
        </View>
      </ScrollView>

      {/* Go Back Button */}
      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-darkAccent rounded-lg py-3.5 flex-row items-center justify-center z-50"
        onPress={() =>
          router.canGoBack() ? router.back() : router.push('/')
        }
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">
          Go Back
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
