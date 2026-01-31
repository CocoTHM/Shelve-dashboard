import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GithubService {
  private readonly githubApiUrl = 'https://api.github.com';

  /**
   * Récupère les repositories d'un utilisateur
   */
  async getUserRepositories(accessToken: string) {
    try {
      const response = await axios.get(`${this.githubApiUrl}/user/repos`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
        params: {
          sort: 'updated',
          per_page: 50,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching repositories:', error.response?.data);
      throw error;
    }
  }

  /**
   * Récupère les issues d'un repository
   */
  async getRepositoryIssues(owner: string, repo: string, accessToken: string) {
    try {
      const response = await axios.get(
        `${this.githubApiUrl}/repos/${owner}/${repo}/issues`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
          params: {
            state: 'open',
            per_page: 20,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching issues:', error.response?.data);
      throw error;
    }
  }

  /**
   * Récupère les pull requests d'un repository
   */
  async getRepositoryPullRequests(
    owner: string,
    repo: string,
    accessToken: string,
  ) {
    try {
      const response = await axios.get(
        `${this.githubApiUrl}/repos/${owner}/${repo}/pulls`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
          params: {
            state: 'open',
            per_page: 20,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching pull requests:', error.response?.data);
      throw error;
    }
  }

  /**
   * Récupère les commits récents d'un repository
   */
  async getRepositoryCommits(
    owner: string,
    repo: string,
    accessToken: string,
  ) {
    try {
      const response = await axios.get(
        `${this.githubApiUrl}/repos/${owner}/${repo}/commits`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
          params: {
            per_page: 20,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching commits:', error.response?.data);
      throw error;
    }
  }

  /**
   * Récupère les informations d'un utilisateur GitHub
   */
  async getUserInfo(accessToken: string) {
    try {
      const response = await axios.get(`${this.githubApiUrl}/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error.response?.data);
      throw error;
    }
  }
}
