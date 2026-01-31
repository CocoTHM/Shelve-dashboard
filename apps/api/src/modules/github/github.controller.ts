import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { GithubService } from './github.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('github')
@Controller('github')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('repos')
  @ApiOperation({ summary: 'Obtenir les repositories de l\'utilisateur' })
  @ApiQuery({ name: 'accessToken', required: true })
  async getUserRepositories(@Query('accessToken') accessToken: string) {
    return this.githubService.getUserRepositories(accessToken);
  }

  @Get('issues')
  @ApiOperation({ summary: 'Obtenir les issues d\'un repository' })
  @ApiQuery({ name: 'owner', required: true })
  @ApiQuery({ name: 'repo', required: true })
  @ApiQuery({ name: 'accessToken', required: true })
  async getRepositoryIssues(
    @Query('owner') owner: string,
    @Query('repo') repo: string,
    @Query('accessToken') accessToken: string,
  ) {
    return this.githubService.getRepositoryIssues(owner, repo, accessToken);
  }

  @Get('pulls')
  @ApiOperation({ summary: 'Obtenir les pull requests d\'un repository' })
  @ApiQuery({ name: 'owner', required: true })
  @ApiQuery({ name: 'repo', required: true })
  @ApiQuery({ name: 'accessToken', required: true })
  async getRepositoryPullRequests(
    @Query('owner') owner: string,
    @Query('repo') repo: string,
    @Query('accessToken') accessToken: string,
  ) {
    return this.githubService.getRepositoryPullRequests(owner, repo, accessToken);
  }

  @Get('commits')
  @ApiOperation({ summary: 'Obtenir les commits récents d\'un repository' })
  @ApiQuery({ name: 'owner', required: true })
  @ApiQuery({ name: 'repo', required: true })
  @ApiQuery({ name: 'accessToken', required: true })
  async getRepositoryCommits(
    @Query('owner') owner: string,
    @Query('repo') repo: string,
    @Query('accessToken') accessToken: string,
  ) {
    return this.githubService.getRepositoryCommits(owner, repo, accessToken);
  }
}
