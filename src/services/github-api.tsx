import {
  GetIssueType,
  RepoType,
  UpdateIssueType,
  UpdateLabelsType,
} from '@src/models/IssueType';
import { UserType } from '@src/models/UserType';

const formatUser = (user: any): UserType | UserType[] => {
  if (user instanceof Array) {
    return user.map((user: any) => {
      return {
        id: user.id,
        name: user.name,
        accountName: user.login,
        avatarUrl: user.avatar_url,
      };
    });
  }
  return {
    id: user.id,
    name: user.name,
    accountName: user.login,
    avatarUrl: user.avatar_url,
  };
};

const formatRepo = (repo: any) => {
  return {
    id: repo.id,
    name: repo.name,
    private: repo.private,
    open_issues_count: repo.open_issues_count,
  };
};

/**
 * get access token
 * @param code
 * @return access token
 */
const getAccessToken = async (code: string) => {
  const res = await fetch('/githubOauth/getAccessToken?code=' + code);
  const accessToken = await res.json();
  return accessToken;
};

/**
 * get user
 * @param token
 * @returns
 */
const getUser = async (token: string) => {
  const res = await fetch('/githubOauth/getUser', {
    method: 'GET',
    headers: { Authorization: 'bearer ' + token },
  });
  const data = await res.json();
  const formattedUser = formatUser(data) as UserType;
  return formattedUser;
};

/**
 * get user issues
 * @param token
 * @param page
 * @return issues
 */
const getUserIssues = async (token: string, page: number) => {
  const res = await fetch(`/githubOauth/getUserIssues/${page}`, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + token },
  });
  const data = await res.json();
  if (data) {
    const formattedIssue: GetIssueType[] = data.map((issue: any) => {
      const formattAssignees: UserType[] = formatUser(
        issue.assignees
      ) as UserType[];
      const formattedUser: UserType = formatUser(issue.user) as UserType;
      const formattedRepo: RepoType = formatRepo(issue.repository);
      return {
        id: issue.id,
        number: issue.number,
        title: issue.title,
        body: issue.body,
        labels: issue.labels,
        state: issue.state,
        user: formattedUser,
        assignees: formattAssignees,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        closed_at: issue.closed_at,
        repository: formattedRepo,
      };
    });
    return formattedIssue;
  }
  return [];
};

/**
 * update issue
 * @param token
 * @param issue
 * @param UpdateParams
 * @returns After update issue
 */
const updateIssue = async (
  token: string,
  issue: UpdateIssueType,
  UpdateParams: UpdateParamsType
) => {
  const res = await fetch(
    `/githubOauth/updateIssue/${UpdateParams.owner}/${UpdateParams.repo}/${UpdateParams.issueNumber}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + token,
        'content-type': 'application/json',
      },
      body: JSON.stringify(issue),
    }
  );
  const data = await res.json();
  return data;
};

/**
 * set issue labels
 * @param token
 * @param issue
 * @param UpdateParams
 * @returns After update issue
 */
const updateIssueLabels = async (
  token: string,
  labels: UpdateLabelsType,
  UpdateParams: UpdateParamsType
) => {
  const res = await fetch(
    `/githubOauth/setLabels/${UpdateParams.owner}/${UpdateParams.repo}/${UpdateParams.issueNumber}`,
    {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
        'content-type': 'application/json',
      },
      body: JSON.stringify(labels),
    }
  );
  const data = await res.json();
  return data;
};

/**
 * search issues
 * @param token
 * @param query
 * @param searchParams
 * @returns search list
 */
const searchIssues = async (
  token: string,
  query: string,
  searchParams: SearchParamsType
) => {
  const repoParams = searchParams.repo ? `repo=${searchParams.repo}&` : '';
  const userParams = searchParams.user ? `user=${searchParams.user}&` : '';
  const queryParams = query ? `query=${query}&` : '';
  const res = await fetch(
    `/githubOauth/search?${repoParams}${userParams}${queryParams}`,
    {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token },
    }
  );
  const data = await res.json();
  if (data && data.items && data.total_count > 0) {
    const searchIssues = data.items.map((issue: any) => {
      const formattAssignees: UserType[] = formatUser(
        issue.assignees
      ) as UserType[];
      const formattedUser: UserType = formatUser(issue.user) as UserType;
      return {
        id: issue.id,
        number: issue.number,
        title: issue.title,
        body: issue.body,
        labels: issue.labels,
        state: issue.state,
        user: formattedUser,
        assignees: formattAssignees,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        closed_at: issue.closed_at,
        repository: {
          name: issue.repository_url?.split('/').slice(-1).join(''),
        },
      };
    });
    return searchIssues;
  }
  return [];
};

/**
 * create a Issue
 * @param token
 * @param Issue
 * @param createParams
 */
const createIssue = async (
  token: string,
  Issue: UpdateIssueType,
  createParams: CreateParamsType
) => {
  const res = await fetch(
    `/githubOauth/create/${createParams.owner}/${createParams.repo}`,
    {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token },
      body: JSON.stringify(Issue),
    }
  );
  const data = await res.json();
  return data;
};

export const githubApi = {
  getAccessToken,
  getUser,
  getUserIssues,
  updateIssue,
  updateIssueLabels,
  searchIssues,
  createIssue,
};

interface SearchParamsType {
  user: string;
  repo?: string;
}

interface CreateParamsType {
  owner: string;
  repo: string;
}
interface UpdateParamsType extends CreateParamsType {
  issueNumber: number;
}
